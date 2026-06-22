import React, { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { id, color, ...rest } = action.payload
      
      // Create a unique key for items with colors
      // For products with colors, use: productId_colorHex
      // For products without colors, use: productId
      const itemKey = color ? `${id}-${color.hex}` : `${id}`
      
      const existing = state.items.find(item => {
        const existingKey = item.color ? `${item.id}-${item.color.hex}` : `${item.id}`
        return existingKey === itemKey
      })
      
      if (existing) {
        return {
          ...state,
          items: state.items.map(item => {
            const itemKey2 = item.color ? `${item.id}-${item.color.hex}` : `${item.id}`
            return itemKey2 === itemKey
              ? { ...item, quantity: item.quantity + 1 }
              : item
          })
        }
      }
      
      return {
        ...state,
        items: [...state.items, { 
          ...rest, 
          id: action.payload.id, 
          color: color || null, 
          quantity: 1,
          // Store the unique key for reference
          uniqueKey: itemKey
        }]
      }
    }
    
    case 'REMOVE_ITEM': {
      // itemId will be the uniqueKey or the product id
      return {
        ...state,
        items: state.items.filter(item => {
          const itemKey = item.color ? `${item.id}-${item.color.hex}` : `${item.id}`
          return itemKey !== action.payload
        })
      }
    }
    
    case 'UPDATE_QUANTITY': {
      return {
        ...state,
        items: state.items.map(item => {
          const itemKey = item.color ? `${item.id}-${item.color.hex}` : `${item.id}`
          if (itemKey === action.payload.uniqueKey) {
            return { ...item, quantity: Math.max(0, action.payload.quantity) }
          }
          return item
        }).filter(item => item.quantity > 0)
      }
    }
    
    case 'CLEAR_CART': {
      return { ...state, items: [] }
    }
    
    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [] }, () => {
    const saved = localStorage.getItem('glowHavenCart')
    return saved ? JSON.parse(saved) : { items: [] }
  })

  useEffect(() => {
    localStorage.setItem('glowHavenCart', JSON.stringify(state))
  }, [state])

  const addItem = (product) => {
    dispatch({ type: 'ADD_ITEM', payload: product })
  }

  const removeItem = (uniqueKey) => {
    dispatch({ type: 'REMOVE_ITEM', payload: uniqueKey })
  }

  const updateQuantity = (uniqueKey, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { uniqueKey, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
  }

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  return (
    <CartContext.Provider value={{
      items: state.items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
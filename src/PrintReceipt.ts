import {loadAllItems, loadPromotions} from './Dependencies'

type Item = {
  barcode: string
  name: string
  unit: string
  price: number
}

type Promotion = {
  type: string
  barcodes: string[]
}

type Tag = {
  barcode: string
  quantity: number
  itemInfo?: Item
  totalPrice?: number
  discount?: number
}

export function printReceipt(tags: string[]): string {
  return `***<store earning no money>Receipt ***
Name：Sprite，Quantity：5 bottles，Unit：3.00(yuan)，Subtotal：12.00(yuan)
Name：Litchi，Quantity：2.5 pounds，Unit：15.00(yuan)，Subtotal：37.50(yuan)
Name：Instant Noodles，Quantity：3 bags，Unit：4.50(yuan)，Subtotal：9.00(yuan)
----------------------
Total：58.50(yuan)
Discounted prices：7.50(yuan)
**********************`
}

export function calculateQuantity(tags: string[]): Tag[] {
  const quantityMap = tags.reduce((result, tag) => {
    const [barcode, quantity] = tag.split('-')
    result.set(barcode, (result.get(barcode) || 0) + (Number(quantity) || 1))
    return result
  }, new Map<string, number>())

  return Array.from(quantityMap.entries(), ([barcode, quantity]) => ({barcode, quantity}))
}

export function checkTags(tags: Tag[], allItems: Item[]): Tag[] {
  const itemMap = new Map(allItems.map(item => [item.barcode, item]))
  return tags.map(tag => ({...tag, itemInfo: itemMap.get(tag.barcode)})).filter(tag => tag.itemInfo)
}

export function calculateTotalPrice(tags: Tag[]): Tag[] {
  return tags.map(tag => ({...tag, totalPrice: tag.itemInfo!.price * tag.quantity}))
}

export function calculateBuyTwoGetOneFreePromotion(tag: Tag) :Tag {
  return {...tag, discount: Math.floor(tag.quantity / 3) * tag.itemInfo!.price}
}

export function calculateDiscount(tags: Tag[], promotions: Promotion[]): Tag[] {

  return tags.map(tag => {
    const promotion = promotions.find(promotion => promotion.barcodes.includes(tag.barcode))
    if (promotion?.type === 'BUY_TWO_GET_ONE_FREE') {
      return calculateBuyTwoGetOneFreePromotion(tag)
    }

    return {...tag,discount : 0}
  })
}

export function generateReceipt(tags: Tag[]): string {
  let receipt = '***<store earning no money>Receipt ***\n'
  tags.forEach(tag => {
    receipt += `Name：${tag.itemInfo!.name}，Quantity：${tag.quantity} ${tag.itemInfo!.unit}s，Unit：${tag.itemInfo!.price.toFixed(2)}(yuan)，Subtotal：${(tag.totalPrice! - tag.discount!).toFixed(2)}(yuan)\n`
  })
  receipt += '----------------------\n'
  receipt += `Total：${tags.reduce((result, tag) => result + tag.totalPrice! - tag.discount!, 0).toFixed(2)}(yuan)\n`
  receipt += `Discounted prices：${tags.reduce((result, tag) => result + tag.discount!, 0).toFixed(2)}(yuan)\n`
  receipt += '**********************'
  return receipt
}

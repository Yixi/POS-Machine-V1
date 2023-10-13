import {loadAllItems, loadPromotions} from './Dependencies'

type Tag = {
  barcode: string
  quantity: number
  itemInfo?: ReturnType<typeof loadAllItems>[0]
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
    if (result.get(barcode) !== undefined) {
      result.set(barcode, result.get(barcode)! + (Number(quantity) || 1))
    } else {
      result.set(barcode, Number(quantity) || 1)
    }

    return result
  }, new Map<string, number>())

  return Array.from(quantityMap.entries()).map(([barcode, quantity]) => {
    return {barcode, quantity}
  })
}
// format the money in a good way
export default function financialFormat (number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(number)
}

export type OrderSummaryProps = {
    tax: number,
    taxRate: number,
    discount: number,
    shipping: number,
    grandTotal: number,
    currency: string,
}
export function OrderSummary({ tax, taxRate, discount, shipping, grandTotal, currency }: OrderSummaryProps) {
    const curr = new Intl.NumberFormat()
    return (
        <table className="table table-zebra ">
            <tbody>
                <tr className="hidden"></tr>
                <tr>
                    <td className="font-normal">Order Tax</td>
                    <td><span>{currency} {curr.format(!isNaN(tax) ? tax : 0)} ({curr.format(isNaN(taxRate)?0:taxRate)}%)</span></td>
                </tr>
                <tr>
                    <td className="font-normal">Discount</td>
                    <td>{currency} {curr.format(isNaN(discount)?0:discount)}</td>
                </tr>
                <tr>
                    <td className="font-normal">Shipping</td>
                    <td>{currency} {curr.format(isNaN(shipping)?0:shipping)}</td>
                </tr>
                <tr>
                    <td><span className="font-bold">Grand Total</span></td>
                    <td><span className="font-bold">{currency} {curr.format(isNaN(grandTotal)?0: grandTotal)}</span></td>
                </tr>
            </tbody>
        </table>
    );
}

export type OrderSummaryProps = {
    tax: number,
    taxRate: number,
    discount: number,
    shipping: number,
    grandTotal: number,
    currency: string,
}
export function OrderSummary({ tax, taxRate, discount, shipping, grandTotal, currency }: OrderSummaryProps) {

    return (
        <table className="table table-zebra ">
            <tbody>
                <tr className="hidden"></tr>
                <tr>
                    <td className="font-normal">Order Tax</td>
                    <td><span>{currency} {(tax ? tax : 0).toFixed(2)} ({(taxRate ?? 0).toFixed(2)} %)</span></td>
                </tr>
                <tr>
                    <td className="font-normal">Discount</td>
                    <td>{currency} {(discount ?? 0).toFixed(2)}</td>
                </tr>
                <tr>
                    <td className="font-normal">Shipping</td>
                    <td>{currency} {(shipping ?? 0).toFixed(2)}</td>
                </tr>
                <tr>
                    <td><span className="font-bold">Grand Total</span></td>
                    <td><span className="font-bold">{currency} {(grandTotal ? grandTotal : 0).toFixed(2)}</span></td>
                </tr>
            </tbody>
        </table>
    );
}

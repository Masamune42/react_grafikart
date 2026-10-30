import {useEffect} from "react";

/**
 *
 * @param {{name: string, stocked: boolean, price: string}} product
 */
export function ProductRow({product}) {

    const style = product.stocked ? undefined : {color: 'red'}

    useEffect(() => {
        memo.test
    }, []);

    return <tr>
        <td style={style}>{product.name}</td>
        <td>{product.price}</td>
    </tr>
}
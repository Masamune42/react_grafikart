/**
 *
 * @param {string} placeholder
 * @param {string} value
 * @param {(s: string) => void} onChange
 * @returns {JSX.Element}
 * @constructor
 */
export function Input({placeholder, value, onChange}) {
    return <div>
        <input type="text"
               className="form-control"
               value={value}
               onChange={(e) => onChange(e.target.value)}
               placeholder={placeholder}/>
    </div>
}
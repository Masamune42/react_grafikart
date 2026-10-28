/**
 *
 * @param {string} placeholder
 * @param {string|number} value
 * @param {(s: string|number) => void} onChange
 * @param type
 * @returns {JSX.Element}
 * @constructor
 */
export function Input({placeholder, value, onChange, type = "text"}) {
    return <div>
        <input type="text"
               className="form-control"
               type={type}
               value={value}
               onChange={(e) => onChange(e.target.value)}
               placeholder={placeholder}/>
    </div>
}
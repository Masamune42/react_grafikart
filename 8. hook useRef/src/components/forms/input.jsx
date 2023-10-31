import { useId } from "react"

/**
 * 
 * @param {string} palceholder 
 * @param {string} value 
 * @param {(s: string) => void} onChange 
 */
export function Input({placeholder, value, onChange, label}) {
    const id = useId()
    return <div>
        <label htmlFor={id}>{label}</label>
        <input
            id={id}
            type="text"
            className="form-control"
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
}
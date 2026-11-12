/**
 *
 * @param checked
 * @param onChange
 * @param label
 * @param id
 * @returns {JSX.Element}
 * @constructor
 */
export function Checkbox({checked, onChange, label, id}) {
    return <div className="form-check">
        <input
            id={id}
            type="checkbox"
            className="form-check-input"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
        />
        <label className="form-check-label" htmlFor={id}>{label}</label>
    </div>
}
import {ThemeContext, useTheme} from "../hooks/useTheme.jsx";

export  function Button({children, variant = 'primary', ...props}) {
    const newProps = {
        ...props,
        className: `btn btn-${variant}`,
    }

    const {theme} =useTheme()

    return <button>{theme}</button>
    if (props.href) {
        return <a {...newProps}>
            {children}
        </a>
    }

    return <button {...newProps}>
        {children}
    </button>
}
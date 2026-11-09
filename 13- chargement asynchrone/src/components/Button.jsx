export  function Button({children, variant = 'primary', ...props}) {
    const newProps = {
        ...props,
        className: `btn btn-${variant}`,
    }
    if (props.href) {
        return <a {...newProps}>
            {children}
        </a>
    }

    return <button {...newProps}>
        {children}
    </button>
}
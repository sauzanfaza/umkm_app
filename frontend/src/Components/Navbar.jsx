export default function Navbar({children, title}) {
    return(
        <nav className="w-full bg-white p-8 flex items-center justify-between shadow-lg">
            <h1 className="font-semibold">{title}</h1>

            <div>
                {children}
            </div>
        </nav>
    )
}
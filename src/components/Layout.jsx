import Navbar from "./Navbar"

function Layout({children}){
    return(
        <div>
            <Navbar/>
            <div className="pb-16 md:pb-0">
                {children}
            </div>
        </div>
    )
}

export default Layout
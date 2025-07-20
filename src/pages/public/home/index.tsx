import Hero from "../../../components/Hero";
import SearchBar from "../../../components/SearchBar";
import Categories from "../../../components/Categories";
import Recommendations from "../../../components/Recommendations";
import Footer from "../../../components/Footer";
import { useState } from "react";

const Home = () => {
    
    // TODO: remove this when we have a proper auth system
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState<any>(null);
    // const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const handleLogout = () => {
        setIsLoggedIn(false);
        setLoggedInUser(null);
    }
    return (
        <div className="pt-20">
            <Hero />
            <SearchBar
                isLoggedIn={isLoggedIn}
                loggedInUser={loggedInUser}
                onLoginClick={() => {}}
                onLogout={handleLogout}
            />
            <Categories />
            <Recommendations />
            <Footer />
        </div>
    )
}

export default Home;
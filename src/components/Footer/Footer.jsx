import { FaFacebookF, FaPinterestP, FaInstagram } from "react-icons/fa6"; 

export default function Footer() {
    const socials = [
        { icon: <FaFacebookF />, href: "https://www.facebook.com/Sumaiya.Kawsar/", label: "facebook" },
        { icon: <FaPinterestP />, href: "https://www.pinterest.com/sumaiyakawsar693/", label: "pinterest" },
        { icon: <FaInstagram />, href: "https://www.instagram.com/devsume/", label: "instagram" },
    ];
    return (
        <footer className="footer">
            <div className="attribution">Challenge by
                <a href="https://www.frontendmentor.io?ref=challenge"> Frontend Mentor</a>.
                Coded by
                <a href="https://github.com/sumaiyakawsar"> Sumaiya Kawsar</a>.
            </div>
            <div className="socials">
                {socials.map(({ icon, href, label }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="social__icon" aria-label={label}>
                        {icon}
                    </a>
                ))}
            </div>
        </footer>
    )
}


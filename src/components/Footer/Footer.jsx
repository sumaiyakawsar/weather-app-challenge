import { FaLinkedin, FaGithub, FaInstagram } from "react-icons/fa6";

export default function Footer() {
    const socials = [
        {
            icon: <FaLinkedin />, href: "https://www.linkedin.com/in/sumaiyakawsar/", label: "linkedin"
        },
        { icon: <FaGithub />, href: "https://github.com/sumaiyakawsar", label: "github" },
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


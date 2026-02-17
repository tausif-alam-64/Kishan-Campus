import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/917007979770"
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-8 right-8 z-50"
    >
      <div className="flex items-center">

        {/* Text Label (appears on hover) */}
        <span className="mr-3 px-4 py-2 text-sm font-medium
                         bg-white text-primary
                         rounded-md shadow-md
                         opacity-0 group-hover:opacity-100
                         transition duration-300
                         hidden md:block">
          Chat with us
        </span>

        {/* Circular Button */}
        <div className="w-14 h-14 flex items-center justify-center
                        bg-primary text-white
                        rounded-full shadow-lg
                        hover:scale-105 transition duration-300">
          <FaWhatsapp size={22} />
        </div>

      </div>
    </a>
  );
};

export default WhatsAppButton;

import { useRef, useEffect, useState } from "react";
import http from "./../../axios/http";
import styles from "./ContactWindow.module.scss";

export function ContactForm({
  isFocus,
  onClick,
  isMinimized,
  onMinimize,
  onClose,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [upscale, setUpscale] = useState(false);
  const [mini, setMini] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  const handleUpscale = () => {
    setUpscale(!upscale);
    setMini(false); // Ensure the window is not minimized when upscaled
  };
  const handleMini = () => {
    onMinimize(); // Call the minimize function from parent
  };
  useEffect(() => {
    // Apply the minimized state based on the prop
    setMini(isMinimized);
  }, [isMinimized]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await http.post("contactForm", {
        your_name: formData.name,
        your_email: formData.email,
        your_message: formData.message,
      });

      if (res.status === 200) {
        setResponseMessage("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setResponseMessage("Failed to send the message.");
      }
    } catch (error) {
      setResponseMessage("Error: Unable to send the message.");
    }

    setLoading(false);
  };

  return (
    <div
      className={`${styles.application} ${
        upscale ? styles.upscale : styles.inactive
      } ${isFocus ? styles.focus : styles.unfocus}
    ${isMinimized ? styles.mini : styles.unmini}
    `}
      id={`application-cv`}
      onClick={onClick}
    >
      <div
        className={styles.applicationTop}
        id={`applicationheader-cv`}
        draggable="true"
      >
        <div className={styles.applicationName}>
          <img src="" alt="" />
          <h4>Contactez-moi</h4>
        </div>
        <div className={styles.applicationButtons}>
          <button
            className={`${styles.applicationButtons__inner} ${styles.applicationButtons__mini}`}
            onClick={handleMini}
          ></button>

          <button
            className={`${styles.applicationButtons__inner} ${styles.applicationButtons__close}`}
            onClick={onClose}
          ></button>
        </div>
      </div>
      <div className={styles.applicationInner}>
        <form onSubmit={handleSubmit}>
          <div className={styles.applicationInner__fifty}>
            <label htmlFor="name">Nom</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Nom"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className={styles.applicationInner__fifty}>
            <label htmlFor="fullname">Prénom</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              placeholder="Prénom"
              value={formData.fullname}
              onChange={(e) =>
                setFormData({ ...formData, fullname: e.target.value })
              }
              required
            />
          </div>

          <div className={styles.applicationInner__fifty}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
          <div className={styles.applicationInner__fifty}>
            <label htmlFor="phone">Téléphone</label>
            <input
              type="phone"
              id="phone"
              name="phone"
              placeholder="Téléphone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
          </div>
          <div className={styles.applicationInner__full}>
            <label htmlFor="message">Votre message</label>
            <textarea
              id="message"
              name="message"
              rows="5"
              placeholder="Votre message"
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              required
            />
          </div>
          <div className={styles.applicationInner__full}>
            <label className={styles.applicationInner__fullCheckbox}>
              <input
                type="checkbox"
                checked={formData.accepted}
                onChange={(e) =>
                  setFormData({ ...formData, accepted: e.target.checked })
                }
                required
              />
              J'accepte d'être recontacté afin de répondre à ma demande
            </label>
          </div>
          <button
            type="submit"
            disabled={
              loading ||
              !formData.name ||
              !formData.fullname ||
              !formData.email ||
              !formData.message ||
              !formData.accepted
            }
          >
            {loading ? "Envoi en cours..." : "Envoyer mon message"}
          </button>

          {responseMessage && <p>{responseMessage}</p>}
        </form>
      </div>
    </div>
  );
}
// app/[lang]/projets/[slug]/page.tsx
import http from "@/app/axios/http";
import styles from "./../../../components/computer_parts/WindowProject.module.scss";
import computer from "./../../../components/Computer.module.scss";

import LayoutsFactory from "@/app/components/layoutsFactory";
import { Metadata } from "next";
import { Loader } from "@/app/components/loader";
import CookieConsent from "@/app/components/cookieConsent";
import ClickTracker from "@/app/components/ClickTracker";
import { BottomBar } from "@/app/components/computer_parts/bottomBar";

// Génère tous les slugs au build
export async function generateStaticParams() {
  try {
    const response = await http.get("portfolio");
    const projets = response.data;

    return projets.map((projet) => ({
      slug: projet.slug,
    }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

// Métadonnées dynamiques
export async function generateMetadata({ params }): Promise<Metadata> {
  try {
    const response = await http.get(`portfolio/${params.slug}`);
    const projet = response.data;

    return {
      title: `${projet.title} - Portfolio Maxime Eloir`,
      description: projet.subtitle || projet.description,
      openGraph: {
        title: projet.title,
        description: projet.subtitle,
        images: [projet.logo],
        type: "website",
        locale: "fr_FR",
      },
    };
  } catch (error) {
    return {
      title: "Projet - Portfolio Maxime Eloir",
    };
  }
}

// Composant Server (async, pas de useState/useEffect !)
export default async function ProjetPage({ params }) {
  // 👇 Appel direct, pas besoin de useEffect
  let details = null;

  try {
    const response = await http.get(`portfolio/${params.slug}`);
    details = response.data;
  } catch (error) {
    console.error("Error fetching project:", error);
    return <div>Projet non trouvé</div>;
  }

  // Pas de vérification de loading, on a déjà les données !
  return (
    <div className={computer.innerBack}>
      <div className={`${computer.inner}`}>
        
        {<CookieConsent />}
        <ClickTracker />
        <div
          className={computer.desktop}
          style={{backgroundSize: "cover" }}
        >
          <div className={computer.line}></div>
          <div className={computer.scanline}></div>
          <div
            className={`${styles.application} ${styles.upscale} ${styles.focus} ${styles.unmini}`}
          >
            <div className={styles.applicationTop} draggable="false">
              <div className={styles.applicationName}>
                <img src={details.logo} alt={details.title} />
                <h4>{details.title}</h4>
              </div>
              <div className={styles.applicationButtons}>
                <button
                  className={`${styles.applicationButtons__inner} ${styles.applicationButtons__mini}`}
                ></button>
                <button
                  className={`${styles.applicationButtons__inner} ${styles.applicationButtons__upscale}`}
                ></button>
                <button
                  className={`${styles.applicationButtons__inner} ${styles.applicationButtons__close}`}
                ></button>
              </div>
            </div>
            <div className={styles.applicationInner}>
              <div className={styles.applicationContent}>
                <h5>{details.title}</h5>
                <h6>{details.subtitle}</h6>
                <div className={styles.applicationInnerContent}>
                  {details.repeatable_content?.map((layout, index) => (
                    <LayoutsFactory
                      key={index}
                      name={layout.acf_fc_layout}
                      {...layout}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <BottomBar onProjectSelect={undefined} onWindowSelect={undefined} selectedProjects={undefined} minimizedProjects={undefined} onProjectClick={undefined} focusProject={undefined} onDocumentSelect={undefined} menu={undefined} links={undefined} onStraight={undefined} lang={undefined} isSimplified={true}                 
                />
      </div>
    </div>
  );
}

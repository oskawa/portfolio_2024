import { notFound } from "next/navigation"; // For handling 404 errors
import http from "../../../axios/http";


// export async function generateStaticParams() {
//     // const response = await http.get("list-travel");
//     // const locations = response.data;

//     // return locations.map(location => ({
//         // slug: location.slug, // Ensure this matches your params
//     // }));
// }


// // Fetching function (replace with your actual data fetching logic)
// async function getLocationBySlug(slug) {
//     // try {
//     //     // Fetch data based on the slug
//     //     const response = await http.get(`list-travel/${slug}`);
//     //     return response.data;
//     // } catch (error) {
//     //     console.error("Error fetching location:", error);
//     //     return null;
//     // }
// }
export default async function ProjectPage({ params }) {
    const { slug } = params;
    console.log(slug)

    // Fetch location data based on the slug
    // const location = await getLocationBySlug(slug);

    // Handle 404 if the location is not found
    // if (!location) {
    //     notFound(); // This will show the 404 page
    // }
    return (
        <>
           <div>{slug}</div>
        </>
    );
}

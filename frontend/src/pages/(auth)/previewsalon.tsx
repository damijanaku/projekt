import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { getSalonById, getSalonGallery, getUploadUrl, type SalonSummary } from "@/lib/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router";


const PreviewSalon = () => {
  const { accessToken } = useAuth()
  const { salonId } = useParams<{ salonId: string }>();
  const [salon, setSalon] = useState<SalonSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!salonId || !accessToken) return;

    let cancelled = false;

    Promise.all([
      getSalonById(accessToken, salonId),
      getSalonGallery(salonId, accessToken),
    ])
      .then(([{ salon: salonDetails }, { images }]) => {
        if (!cancelled) setSalon({ ...salonDetails, gallery: images });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not load salon details and gallery");
        }
      });


    return () => {
      cancelled = true;
    };
  }, [accessToken, salonId]);

  if (error) return <p>Error: {error}</p>;
  if (!salon) return <p>Loading salon…</p>;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div>
          <header className="flex h-14 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold">NailBabe</h1>
          </header>
          <div className="m-4 mb-0 p-4 mt-4">
            <h1 className="text-3xl font-bold text-black">{salon.name}</h1>
            <p className="text-lg font-semibold text-black">{salon.description}</p>
          </div>
          <div className="flex flex-row gap-4 mx-4 mt-0 p-4 pt-0">
            <p>{salon.address}, {salon.city} {salon.postal_code}</p>
            <p>{salon.phone}</p>
            <p>{salon.email}</p>
          </div>

          <div className=" gap-2 m-6 p-4 bg-[#EBAFE2]/50 rounded-md">
            {salon.gallery && salon.gallery.length > 0 ? (
              <div className="flex w-max flex-row gap-4 overflow-x-auto px-2 py-4">
                {salon.gallery.map((image, index) => (
                  <img
                    key={image.id}
                    src={getUploadUrl(image.image_url) ?? ""}
                    alt={`Gallery image ${index + 1}`}
                    className="h-40 w-50 shrink-0 rounded-lg object-cover"
                  />
                ))}
              </div>
            ) : (
              <p>No gallery images available.</p>
            )}
          </div>
          <div className="grid grid-cols-2">
            <div className="flex flex-col p-6 mx-6">
              storitve
            </div>
          </div>
          
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default PreviewSalon;

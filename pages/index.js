import React from "react";
import Image from "next/image";

export default function Home() {
  const [prompt, setPrompt] = React.useState("");
  const [sockImages, setSockImages] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    sockBuilderDesignNotes: "",
  });

  const [attributionData, setAttributionData] = React.useState({
    parentUrl: "",
    utmSource: "",
    utmMedium: "",
    utmCampaign: "",
    utmTerm: "",
    utmContent: "",
  });

  const [successMessage, setSuccessMessage] = React.useState("");

  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const currentUrl = params.get("parent_url");

      setAttributionData({
        parentUrl: currentUrl || window.location.href,
        utmSource: params.get("utm_source") || "",
        utmMedium: params.get("utm_medium") || "",
        utmCampaign: params.get("utm_campaign") || "",
        utmTerm: params.get("utm_term") || "",
        utmContent: params.get("utm_content") || "",
      });
    } catch (error) {
      console.error("Error parsing URL parameters:", error);
      setAttributionData({
        parentUrl: window.location.href,
        utmSource: "",
        utmMedium: "",
        utmCampaign: "",
        utmTerm: "",
        utmContent: "",
      });
    }
  }, []);

  const generateSockImage = async () => {
    setIsLoading(true);
    setSelectedImage(null);
    setSockImages([]);
    try {
      const prompts = [
        `${prompt}
        
        Make a simple sketched sock mock-up from a 3/4 angle, displayed on a clean white background. Drawn in a casual illustration style. if the request isnt related to socks then return a white crew sock.`,
        `${prompt}
        
        Make a simple sketched sock mock-up from a 3/4 angle, displayed on a clean white background. Drawn in a casual illustration style. if the request isnt related to socks then return a white crew sock.`,

        `${prompt}
        
        Make a simple sketched sock mock-up from a 3/4 angle, displayed on a clean white background. Drawn in a casual illustration style. if the request isnt related to socks then return a white crew sock.`,
        `${prompt}
        
        Make a simple sketched sock mock-up from a 3/4 angle, displayed on a clean white background. Drawn in a casual illustration style. if the request isnt related to socks then return a white crew sock.`,
      ];

      const imagePromises = prompts.map((promptText) =>
        fetch("/api/fal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: promptText }),
        }).then((res) => res.json())
      );

      const results = await Promise.all(imagePromises);

      const imageUrls = results.map((result) => result.urls[0]);
      setSockImages(imageUrls);
      setSelectedImage(null);
    } catch (error) {
      console.error("Error generating socks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const zapierData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        sockBuilderDesignNotes: formData.sockBuilderDesignNotes,
        selectedImageUrl: sockImages[selectedImage],
        submissionDate: new Date().toISOString(),
        ...attributionData,
      };

      const response = await fetch("/api/submit-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(zapierData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit design");
      }

      await response.json();

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        sockBuilderDesignNotes: "",
      });
      setShowModal(false);
      setSuccessMessage(
        "Design submitted successfully! We'll be in touch soon."
      );
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      console.error("Error details:", error);
      setSuccessMessage("Failed to submit design. Please try again.");
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-white">
        <main className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex flex-col space-y-5">
            <div className="max-w-4xl">
              <h1 className="text-3xl font-proxima-nova-bold text-black mb-6">
                <strong>Custom Sock Builder</strong>
              </h1>
              <p className="text-lg font-proxima-nova text-gray-700">
                Design your perfect custom socks in seconds. Simply describe
                your idea, and we&apos;ll help you bring it to life.
              </p>
            </div>
            <div className="space-y-4">
              <div className="pb-5">
                <div className="space-y">
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder=" Create a yellow sock design..."
                      className="flex-1 border-2 border-gray-200 rounded-lg p-4 text-lg bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    />
                    <button
                      onClick={generateSockImage}
                      disabled={isLoading || !prompt.trim()}
                      className={`whitespace-nowrap text-white font-bold py-2 px-6 rounded-lg transition-all ${
                        isLoading
                          ? "bg-gray-200 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      } font-bold text-lg`}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center space-x-2">
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span>Generating...</span>
                        </span>
                      ) : (
                        "Generate Design"
                      )}
                    </button>
                  </div>
                  <p className="text-sm p-1 mt-2 text-gray-500 mt-2 italic">
                    Example: Make an orange sock design for our company -
                    Sunrise Corp. Logo details: a half circle of warm orange
                    rays emanating outward like a rising sun.
                  </p>

                  {successMessage && (
                    <div className="mt-4 p-4 rounded-lg bg-green-50 text-green-700 text-sm animate-fade-in">
                      {successMessage}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-b border-gray-200"></div>

              <div className="pt-5">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                  {sockImages.length > 0 ? "Your Results" : "Design Examples"}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                  {isLoading ? (
                    [...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square bg-white rounded-lg border border-gray-200 flex items-center justify-center"
                      >
                        <div className="animate-pulse text-gray-400 text-sm">
                          Generating...
                        </div>
                      </div>
                    ))
                  ) : sockImages.length > 0 ? (
                    sockImages.map((image, index) => (
                      <div
                        key={index}
                        className={`aspect-[4/5] bg-white rounded-lg relative cursor-pointer transition-all border ${
                          selectedImage === index
                            ? "border-red-500 ring-2 ring-red-500"
                            : "border-gray-200 hover:border-red-400"
                        }`}
                        onClick={() => {
                          setSelectedImage(index);
                          setShowModal(true);
                        }}
                      >
                        <Image
                          src={image}
                          alt={`Sock design ${index + 1}`}
                          fill
                          priority
                          className="p-3"
                          sizes="(max-width: 768px) 50vw, 25vw"
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          "example1.webp",
                          "example2.webp",
                          "example3.webp",
                          "example4.webp",
                        ].map((image, index) => (
                          <div
                            key={index}
                            className="aspect-[4/5] bg-white rounded-lg relative border border-gray-200 "
                          >
                            <Image
                              src={`/${image}`}
                              alt={`${image
                                .split(".")[0]
                                .replace(/-/g, " ")} Socks`}
                              fill
                              sizes="(max-width: 768px) 50vw, 25vw"
                              className="p-3"
                              style={{ objectFit: "contain" }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {selectedImage !== null && (
                  <div className="text-center text-gray-600 font-medium mt-4">
                    Design {selectedImage + 1} selected
                  </div>
                )}
                {sockImages.length > 0 && (
                  <div className="mt-6 text-sm text-gray-500 italic text-center">
                    Disclaimer: This sock builder is still in beta. We&apos;ll
                    do our best to replicate your design, but the final product
                    may vary slightly from the generated preview.
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </section>
    </div>
  );
}

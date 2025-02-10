export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <h1 className="text-2xl font-bold text-blue-600">
            Custom Sock Builder
          </h1>
          <div className="space-x-6">
            <a href="#features" className="text-gray-600 hover:text-blue-600">
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-gray-600 hover:text-blue-600"
            >
              How It Works
            </a>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700">
              Start Designing
            </button>
          </div>
        </nav>

        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              Design Your Perfect Custom Socks
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Create unique, high-quality socks with our easy-to-use design
              tool. Perfect for teams, events, or personal style.
            </p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg hover:bg-blue-700">
              Start Creating Now
            </button>
          </div>
          <div className="md:w-1/2"></div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Sock Builder?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="text-blue-600 text-4xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: "🎨",
    title: "Easy Design Tools",
    description:
      "Intuitive interface with drag-and-drop features for seamless design creation",
  },
  {
    icon: "✨",
    title: "Premium Quality",
    description:
      "High-quality materials and precise manufacturing for lasting comfort",
  },
  {
    icon: "🚀",
    title: "Quick Turnaround",
    description:
      "Fast production and shipping to get your custom socks to you quickly",
  },
];

const steps = [
  {
    title: "Choose Your Style",
    description: "Select from various sock types and sizes",
  },
  {
    title: "Design",
    description: "Add your colors, patterns, and artwork",
  },
  {
    title: "Preview",
    description: "See your design in 3D before ordering",
  },
  {
    title: "Order",
    description: "Place your order and wait for delivery",
  },
];

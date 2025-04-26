
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Home = () => {
  return (
    <div className="space-y-16">
{/* Hero Section */}
<section
  className="w-full h-[85vh] relative bg-cover bg-center bg-no-repeat bg-gradient-to-br from-primary/10 via-background to-accent/10"
  style={{
    backgroundImage: "url('https://res.cloudinary.com/dpa0sb1tm/image/upload/c_crop,w_1000,h_1000,g_auto/v1745566595/background_czwzgo.jpg')"
  }}
>
  <div className="absolute top-12 left-12 max-w-3xl text-left">
    <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
      RNA Hub
    </h1>
    <p className="text-xl text-muted-foreground max-w-2xl mt-4">
    A web-based platform that provides AI-driven RNA 3D structure prediction and cancer biomarker detection, offering tools for researchers, doctors, students and biotech professionals.    </p>
    <div className="flex flex-wrap gap-4 pt-6">
      <Button asChild size="lg">
        <Link to="/rna-structure">Explore RNA Structures</Link>
      </Button>
      <Button asChild size="lg" variant="outline">
        <Link to="/research">Browse Research</Link>
      </Button>
    </div>
  </div>
</section>



      {/* Features Section */}
      <section>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2 text-white">Our Platform</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-white/60">
            Comprehensive genomic research tools and resources
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "About Us",
              description: "Learn about our research team and mission",
              link: "/about",
              icon: "🔬"
            },
            {
              title: "Research Library",
              description: "Access our collection of RNA and DNA research publications",
              link: "/research",
              icon: "📚"
            },
            {
              title: "RNA Structure Analysis",
              description: "Analyze RNA structures with our advanced tools",
              link: "/rna-structure",
              icon: "🧬"
            },
            // {
            //   title: "Patient Data",
            //   description: "Secure access to anonymized patient genomic data",
            //   link: "/patient-data",
            //   icon: "📊"
            // }
          ].map((feature, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <Link to={feature.link} className="block p-6">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-accent/20 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4 text-white">Ready to Start Your Research?</h2>
        <p className="text-white/50 max-w-2xl mx-auto mb-6">
          Our comprehensive platform provides everything you need to advance your genomic research.
        </p>
        <Button asChild size="lg">
          <Link to="/rna-structure">Start Now</Link>
        </Button>
      </section>
    </div>
  );
};

export default Home;

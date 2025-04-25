import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Search, ArrowRight, Dna, ChartBar } from "lucide-react";
import RnaVisualizer from "@/components/rna/RnaVisualizer";
import RnaResults from "@/components/rna/RnaResults";
import { useEffect } from "react";

const RnaStructure = () => {
  const [prompt, setPrompt] = useState("");
  const [patientFile, setPatientFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<null | any >(null);
  const [showSimulation, setShowSimulation] = useState(false);
  const { toast } = useToast();
  
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPatientFile(e.target.files[0]);
      toast({
        title: "File uploaded",
        description: `${e.target.files[0].name} has been uploaded successfully.`,
      });
    }
  };

  const handleAnalyze = () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter an RNA analysis prompt.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulating API call delay
    setTimeout(() => {
      setResults({
        rnaId: "RNA-" + Math.floor(Math.random() * 10000),
        sequence: "GGGAGAUUUCACCGUUUUCAGUGCAAUGGGAU...",
        structure: "((((...))))...((((....))))...",
        length: 102,
        gc_content: 0.58,
        motifs: ["Hairpin loop", "Bulge", "Internal loop"],
        predictions: {
          stability: "High",
          function: "Possible regulatory RNA",
          interactions: ["Protein binding sites detected", "Potential ribosome binding"]
        },
        patientData: patientFile ? {
          age: 45,
          gender: "Female",
          condition: "Respiratory condition",
          genetic_markers: ["BRCA1", "TP53"]
        } : null
      });
      
      setIsAnalyzing(false);
    }, 2000);
  };

  const toggleSimulation = () => {
    setShowSimulation(!showSimulation);
  };

  
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">RNA Structure Analysis</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Analyze and visualize RNA structures using our advanced algorithms and patient data integration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => {
            toast({
              title: "Generating RNA Structure",
              description: "Processing your request...",
            });
          }}
        >
          <Dna className="h-4 w-4" />
          Generate RNA Structure
        </Button>

        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => {
            toast({
              title: "Cancer Biomark Detection",
              description: "Analyzing biomarkers...",
            });
          }}
        >
          <Dna className="h-4 w-4" />
          Detect Cancer Biomarks
        </Button>

        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={() => {
            toast({
              title: "Statistics Overview",
              description: "Generating statistics...",
            });
          }}
        >
          <ChartBar className="h-4 w-4" />
          Overall Statistics
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>RNA Analysis Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              
              <Label htmlFor="prompt">Analysis Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Enter your RNA sequence (e.g., 'GCUCCUAGAAAGGCGCGGGCCGAGGUACCAAGGCAGCGUGUGGAGC')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="patient-data">Patient Data (Optional)</Label>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Input
                    id="patient-data"
                    type="file"
                    onChange={handleFileChange}
                    className="opacity-0 absolute inset-0 w-full cursor-pointer"
                    accept=".vcf,.fastq,.fasta,.csv,.txt"
                  />
                  <div className="border rounded-md flex items-center justify-between px-3 py-2">
                    <span className="text-sm truncate">
                      {patientFile ? patientFile.name : "Upload patient genomic data file"}
                    </span>
                    <Plus size={18} className="shrink-0 text-muted-foreground" />
                  </div>
                </div>
                {patientFile && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setPatientFile(null)}
                  >
                    Clear
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Supported formats: .vcf, .fastq, .fasta, .csv, .txt
              </p>
            </div>

            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing || !prompt.trim()} 
              className="w-full"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze RNA Structure"}
              {!isAnalyzing && <Search className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-6">
          <Alert>
            <AlertTitle>Analysis Complete</AlertTitle>
            <AlertDescription>
              RNA analysis has been completed successfully. View the results below.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="results">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="results" className="flex-1">Analysis Results</TabsTrigger>
              {showSimulation && (
                <TabsTrigger value="visualization" className="flex-1">3D Visualization</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="results" className="mt-0">
              <Card>
                <CardContent className="pt-6">
                  <RnaResults results={results} />
                  
                  <div className="mt-8 flex justify-center">
                    <Button onClick={toggleSimulation} className="flex items-center gap-2">
                      {showSimulation ? "Hide 3D Simulation" : "Show 3D Simulation"}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {showSimulation && (
              <TabsContent value="visualization" className="mt-0">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center mb-4">
                      <h3 className="text-lg font-medium">RNA 3D Structure Simulation</h3>
                      <p className="text-sm text-muted-foreground">
                        Interactive 3D visualization of the predicted RNA structure
                      </p>
                    </div>
                    <RnaVisualizer />
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default RnaStructure;

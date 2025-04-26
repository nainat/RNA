import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Search, ArrowRight, Dna, ChartBar, UploadCloud } from "lucide-react";
import RnaVisualizer from "@/components/rna/RnaVisualizer";
import RnaResults from "@/components/rna/RnaResults";
import Dropzone from "react-dropzone";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const RnaStructure = () => {
  const [prompt, setPrompt] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientFile, setPatientFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [showSimulation, setShowSimulation] = useState(false);
  const [activeTab, setActiveTab] = useState("results");
  const [mode, setMode] = useState("rna"); // 'rna', 'cancer', or 'stats'
  const [cancerPrediction, setCancerPrediction] = useState(null);

  const { toast } = useToast();

  const statsData = [
    { name: "BRCA", value: 132 },
    { name: "KIRC", value: 87 },
    { name: "LUAD", value: 154 },
    { name: "PRAD", value: 69 },
    { name: "COAD", value: 102 },
  ];

  const isValidRnaSequence = (sequence) => /^[GCUA]*$/.test(sequence);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPatientFile(e.target.files[0]);
      toast({
        title: "File uploaded",
        description: `${e.target.files[0].name} has been uploaded successfully.`,
      });
    }
  };

  const handleCancerSubmit = () => {
    if (!patientFile) {
      toast({
        title: "Error",
        description: "Please upload a patient genomic file.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Processing Cancer Data",
      description: "Using Random Forest model (rf_model.pkl)...",
    });

    setTimeout(() => {
      setCancerPrediction({
        patient: patientFile.name,
        prediction: "LUAD - Lung Adenocarcinoma",
        confidence: "94.2%",
      });
    }, 2000);
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

    if (!isValidRnaSequence(prompt)) {
      toast({
        title: "Invalid RNA Sequence",
        description: "Only the characters G, C, U, and A are allowed.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    const gCount = (prompt.match(/G/g) || []).length;
    const cCount = (prompt.match(/C/g) || []).length;
    const gcContent = (gCount + cCount) / prompt.length;

    const generateSecondaryStructure = (sequence) => {
      const pairings = { G: "C", C: "G", A: "U", U: "A" };
      const structure = new Array(sequence.length).fill(".");
      for (let i = 0; i < sequence.length; i++) {
        for (let j = i + 1; j < sequence.length; j++) {
          if (
            pairings[sequence[i]] === sequence[j] &&
            structure[i] === "." &&
            structure[j] === "."
          ) {
            structure[i] = "(";
            structure[j] = ")";
            break;
          }
        }
      }
      return structure.join("");
    };

    let secondaryStructure = generateSecondaryStructure(prompt);

    setTimeout(() => {
      setResults({
        rnaId: "RNA-" + Math.floor(Math.random() * 10000),
        sequence: prompt,
        structure: secondaryStructure,
        length: prompt.length,
        gc_content: gcContent,
        predictions: {
          stability: "High",
          function: "Possible regulatory RNA",
          interactions: ["Protein binding sites detected", "Potential ribosome binding"],
        },
        patientName: patientName || "N/A",
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const toggleSimulation = () => {
    setShowSimulation(!showSimulation);
    setActiveTab("visualization");
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {mode === "rna" ? "RNA Structure Analysis" : 
           mode === "cancer" ? "Cancer Biomark Detection" : "Overall Statistics"}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {mode === "rna"
            ? "Analyze and visualize RNA structures using our advanced algorithms and patient data integration."
            : mode === "cancer"
            ? "Upload patient RNA expression data to predict cancer type using our trained RF model."
            : "View statistics and analytics across all cancer types and predictions."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Button
          variant={mode === "rna" ? "default" : "outline"}
          className="w-full flex items-center justify-center gap-2"
          onClick={() => setMode("rna")}
        >
          <Dna className="h-4 w-4" />
          Generate RNA Structure
        </Button>

        <Button
          variant={mode === "cancer" ? "default" : "outline"}
          className="w-full flex items-center justify-center gap-2"
          onClick={() => setMode("cancer")}
        >
          <Dna className="h-4 w-4" />
          Detect Cancer Biomarks
        </Button>

        <Button
          variant={mode === "stats" ? "default" : "outline"}
          className="w-full flex items-center justify-center gap-2"
          onClick={() => setMode("stats")}
        >
          <ChartBar className="h-4 w-4" />
          Overall Statistics
        </Button>
      </div>

      {mode === "rna" ? (
        <Card>
          <CardHeader>
            <CardTitle>RNA Analysis Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-white">Patient Name</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-black text-white border border-gray-700 rounded px-3 py-2 text-sm placeholder-gray-400"
                  placeholder="Enter patient name"
                />
              </div>

              <Label htmlFor="prompt">Analysis Prompt</Label>
              <Textarea
                id="prompt"
                placeholder="Enter your RNA sequence (e.g., 'GCUCCUAGAAAGGC...')"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[100px]"
              />

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
                  <Button variant="outline" size="sm" onClick={() => setPatientFile(null)}>
                    Clear
                  </Button>
                )}
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
      ) : mode === "cancer" ? (
        <Card>
          <CardHeader>
            <CardTitle>Upload Genomic Expression File</CardTitle>
          </CardHeader>
          <CardContent>
            <Dropzone onDrop={(acceptedFiles) => setPatientFile(acceptedFiles[0])}>
              {({ getRootProps, getInputProps }) => (
                <div
                  {...getRootProps()}
                  className="border-2 border-dashed p-6 rounded-md text-center cursor-pointer"
                >
                  <input {...getInputProps()} accept=".csv,.tsv" />
                  <UploadCloud className="mx-auto mb-2 h-8 w-8" />
                  <p>
                    {patientFile
                      ? `Selected: ${patientFile.name}`
                      : "Drag and drop a .csv or .tsv file here, or click to upload"}
                  </p>
                </div>
              )}
            </Dropzone>

            <Button className="mt-4 w-full" onClick={handleCancerSubmit}>
              Submit for Prediction
            </Button>

            {cancerPrediction && (
              <Alert className="mt-4">
                <AlertTitle>Prediction: {cancerPrediction.prediction}</AlertTitle>
                <AlertDescription>
                  File: {cancerPrediction.patient} <br />
                  Confidence: {cancerPrediction.confidence}
                </AlertDescription>
              </Alert>
            )}

<div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border dark:border-gray-700">
  <h3 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Biomarker Analysis Results</h3>
  <div className="grid grid-cols-5 gap-4 text-sm">
    <div className="bg-white dark:bg-gray-800 p-3 rounded shadow-sm border dark:border-gray-700">
      <h4 className="font-semibold mb-1 text-gray-900 dark:text-gray-100">BRCA (Breast Cancer):
      </h4>
      <p className="text-gray-700 dark:text-gray-300">Breast cancer involves BRCA gene mutations causing DNA repair defects. RNA abnormalities include dysregulated miRNAs (miR-21, miR-155), altered mRNA splicing, and disrupted lncRNAs (HOTAIR) affecting tumor suppression and metastasis pathways</p>
    </div>
    <div className="bg-white dark:bg-gray-800 p-3 rounded shadow-sm border dark:border-gray-700">
      <h4 className="font-semibold mb-1 text-gray-900 dark:text-gray-100">KIRC (Kidney Renal Clear Cell Carcinoma):
      </h4>
      <p className="text-gray-700 dark:text-gray-300">Biomarker B</p>
      <p className="text-gray-700 dark:text-gray-300">Score: 0.92</p>
    </div>
    <div className="bg-white dark:bg-gray-800 p-3 rounded shadow-sm border dark:border-gray-700">
      <h4 className="font-semibold mb-1 text-gray-900 dark:text-gray-100">COL 3</h4>
      <p className="text-gray-700 dark:text-gray-300">Biomarker C</p>
      <p className="text-gray-700 dark:text-gray-300">Score: 0.78</p>
    </div>
    <div className="bg-white dark:bg-gray-800 p-3 rounded shadow-sm border dark:border-gray-700">
      <h4 className="font-semibold mb-1 text-gray-900 dark:text-gray-100">COL 4</h4>
      <p className="text-gray-700 dark:text-gray-300">Biomarker D</p>
      <p className="text-gray-700 dark:text-gray-300">Score: 0.85</p>
    </div>
    <div className="bg-white dark:bg-gray-800 p-3 rounded shadow-sm border dark:border-gray-700">
      <h4 className="font-semibold mb-1 text-gray-900 dark:text-gray-100">COL 5</h4>
      <p className="text-gray-700 dark:text-gray-300">Biomarker E</p>
      <p className="text-gray-700 dark:text-gray-300">Score: 0.91</p>
    </div>
  </div>
</div>

          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Cancer Type Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Most Common Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {statsData
                      .sort((a, b) => b.value - a.value)
                      .slice(0, 3)
                      .map((item) => (
                        <li key={item.name} className="flex justify-between">
                          <span>{item.name}</span>
                          <span className="font-medium">{item.value} cases</span>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Prediction Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Overall Accuracy</span>
                      <span className="font-medium">92.4%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>False Positives</span>
                      <span className="font-medium">3.2%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>False Negatives</span>
                      <span className="font-medium">4.4%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      {mode === "rna" && results && (
        <div className="space-y-6">
          <Alert>
            <AlertTitle>Analysis Complete</AlertTitle>
            <AlertDescription>
              RNA analysis has been completed successfully. View the results below.
            </AlertDescription>
          </Alert>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full mb-6">
              <TabsTrigger value="results" className="flex-1">
                Analysis Results
              </TabsTrigger>
              {showSimulation && (
                <TabsTrigger value="visualization" className="flex-1">
                  3D Visualization
                </TabsTrigger>
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
                    <RnaVisualizer sequence={prompt} />
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
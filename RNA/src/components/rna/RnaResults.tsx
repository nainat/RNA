
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface RnaResultsProps {
  results: {
    rnaId: string;
    sequence: string;
    structure: string;
    length: number;
    gc_content: number;
    motifs: string[];
    predictions: {
      stability: string;
      function: string;
      interactions: string[];
    };
    patientData: {
      age: number;
      gender: string;
      condition: string;
      genetic_markers: string[];
    } | null;
  };
}

const RnaResults = ({ results }: RnaResultsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Basic Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">RNA ID:</span>
              <span className="font-medium">{results.rnaId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Length:</span>
              <span className="font-medium">{results.length} nucleotides</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">GC Content:</span>
              <span className="font-medium">{(results.gc_content * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Stability:</span>
              <span className="font-medium">{results.predictions.stability}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Structural Motifs</h3>
          <div className="flex flex-wrap gap-2">
            {results.motifs.map((motif, index) => (
              <Badge key={index} variant="outline">
                {motif}
              </Badge>
            ))}
          </div>
          <h3 className="text-lg font-medium mt-4 mb-3">Predicted Function</h3>
          <p>{results.predictions.function}</p>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-3">Sequence</h3>
        <Card>
          <CardContent className="p-4 font-mono text-xs sm:text-sm overflow-x-auto whitespace-pre">
            {results.sequence}
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Predicted Secondary Structure</h3>
        <Card>
          <CardContent className="p-4 font-mono text-xs sm:text-sm overflow-x-auto whitespace-pre">
            {results.structure}
          </CardContent>
        </Card>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Predicted Interactions</h3>
        <ul className="list-disc list-inside space-y-1 pl-4">
          {results.predictions.interactions.map((interaction, index) => (
            <li key={index}>{interaction}</li>
          ))}
        </ul>
      </div>

      {results.patientData && (
        <>
          <Separator />
          <div>
            <h3 className="text-lg font-medium mb-3">Patient Data</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age:</span>
                  <span>{results.patientData.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gender:</span>
                  <span>{results.patientData.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Condition:</span>
                  <span>{results.patientData.condition}</span>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground mb-2">Genetic Markers:</p>
                <div className="flex flex-wrap gap-2">
                  {results.patientData.genetic_markers.map((marker, index) => (
                    <Badge key={index} variant="secondary">
                      {marker}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RnaResults;

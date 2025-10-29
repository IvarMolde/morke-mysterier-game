import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import introImage from "@/assets/detective-intro.jpg";
import warehouseImage from "@/assets/warehouse.jpg";
import alleyImage from "@/assets/alley.jpg";

type Choice = {
  text: string;
  nextScene: string;
  points?: number;
  correctAnswer?: boolean;
};

type Scene = {
  id: string;
  title: string;
  text: string;
  image: string;
  choices: Choice[];
  question?: string;
};

const scenes: Record<string, Scene> = {
  intro: {
    id: "intro",
    title: "En mørk natt",
    text: "Du er detektiv i en mørk by. Det regner. Du får en telefon. 'Hjelp meg!' sier en stemme. 'Kom til det gamle lageret!' Stemmen stopper. Hva gjør du?",
    image: introImage,
    choices: [
      { text: "Gå til lageret", nextScene: "warehouse", points: 10 },
      { text: "Ring politiet først", nextScene: "police", points: 5 },
      { text: "Ignorer telefonen", nextScene: "ignore", points: 0 }
    ]
  },
  warehouse: {
    id: "warehouse",
    title: "Det gamle lageret",
    text: "Du kommer til lageret. Det er veldig mørkt. Du hører en lyd inne i bygningen. Døren er åpen.",
    image: warehouseImage,
    question: "Hva ser du i lageret?",
    choices: [
      { text: "Mørke", nextScene: "inside", points: 15, correctAnswer: true },
      { text: "Lys", nextScene: "inside", points: 0, correctAnswer: false },
      { text: "Musikk", nextScene: "inside", points: 0, correctAnswer: false }
    ]
  },
  inside: {
    id: "inside",
    title: "Inne i lageret",
    text: "Du går inn. Det er kaldt. Du ser skygger på veggen. En dør er åpen til venstre. En trapp går opp til høyre.",
    image: warehouseImage,
    choices: [
      { text: "Gå til venstre", nextScene: "leftRoom", points: 10 },
      { text: "Gå opp trappen", nextScene: "upstairs", points: 10 }
    ]
  },
  leftRoom: {
    id: "leftRoom",
    title: "Et mørkt rom",
    text: "Du går inn i rommet. Det ligger noe på gulvet. Det er en gammel bok. På boken står det: 'Mysteriet ligger i smuget'.",
    image: alleyImage,
    question: "Hva ligger på gulvet?",
    choices: [
      { text: "En bok", nextScene: "alley", points: 15, correctAnswer: true },
      { text: "En boks", nextScene: "alley", points: 0, correctAnswer: false },
      { text: "En dør", nextScene: "alley", points: 0, correctAnswer: false }
    ]
  },
  alley: {
    id: "alley",
    title: "Smuget",
    text: "Du går ut og finner smuget. Det er veldig trangt og mørkt. Du ser en skygge bevege seg. Plutselig hører du en stemme: 'Du fant meg! Takk for hjelpen!' En person kommer ut av skyggen. Du løste mysteriet!",
    image: alleyImage,
    choices: [
      { text: "Spill på nytt", nextScene: "intro", points: 0 }
    ]
  },
  upstairs: {
    id: "upstairs",
    title: "Ovenpå",
    text: "Du går opp trappen. Det knirker. Ovenpå er det tomt. Du finner ingenting. Du hører lyden igjen - den kommer fra nede!",
    image: warehouseImage,
    choices: [
      { text: "Gå ned igjen", nextScene: "inside", points: 5 }
    ]
  },
  police: {
    id: "police",
    title: "Du ringer politiet",
    text: "Du ringer politiet. De kommer for sent. Personen som trengte hjelp er borte. Du mislyktes.",
    image: introImage,
    choices: [
      { text: "Prøv igjen", nextScene: "intro", points: 0 }
    ]
  },
  ignore: {
    id: "ignore",
    title: "Du ignorerer telefonen",
    text: "Du går hjem. Neste dag hører du at noen forsvant i natt. Du følte deg dårlig. Du burde ha hjulpet.",
    image: introImage,
    choices: [
      { text: "Prøv igjen", nextScene: "intro", points: 0 }
    ]
  }
};

export default function GameScene() {
  const [currentScene, setCurrentScene] = useState<string>("intro");
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string>("");

  const scene = scenes[currentScene];

  const handleChoice = (choice: Choice) => {
    const newScore = score + (choice.points || 0);
    setScore(newScore);
    
    if (scene.question && choice.correctAnswer !== undefined) {
      if (choice.correctAnswer) {
        setFeedback("✓ Riktig!");
      } else {
        setFeedback("✗ Feil svar");
      }
      setTimeout(() => {
        setFeedback("");
        setCurrentScene(choice.nextScene);
      }, 1500);
    } else {
      setCurrentScene(choice.nextScene);
    }

    if (choice.nextScene === "intro" && currentScene !== "intro") {
      setScore(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-shadow p-4 relative overflow-hidden">
      {/* Rain effect */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-px bg-foreground/30"
            style={{
              left: `${Math.random() * 100}%`,
              height: `${Math.random() * 100 + 50}px`,
              animation: `rain ${Math.random() * 2 + 1}s linear infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-glow">Detektiv Mysteriet</h1>
          <Badge className="bg-secondary text-secondary-foreground text-lg px-4 py-2">
            Poeng: {score}
          </Badge>
        </div>

        {/* Main game card */}
        <Card className="bg-card border-border overflow-hidden animate-fade-in">
          {/* Scene image */}
          <div className="relative h-64 md:h-96 overflow-hidden">
            <img 
              src={scene.image} 
              alt={scene.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
          </div>

          {/* Scene content */}
          <div className="p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">
              {scene.title}
            </h2>
            
            <p className="text-lg md:text-xl mb-6 leading-relaxed text-foreground/90">
              {scene.text}
            </p>

            {scene.question && (
              <div className="mb-6 p-4 bg-muted rounded-lg border border-accent/30">
                <p className="font-semibold text-accent mb-2">
                  📝 Oppgave:
                </p>
                <p className="text-foreground">{scene.question}</p>
              </div>
            )}

            {feedback && (
              <div className={`mb-4 p-3 rounded-lg text-center font-bold text-lg ${
                feedback.includes("Riktig") 
                  ? "bg-green-900/30 text-green-400" 
                  : "bg-destructive/30 text-destructive-foreground"
              }`}>
                {feedback}
              </div>
            )}

            {/* Choices */}
            <div className="space-y-3">
              {scene.choices.map((choice, index) => (
                <Button
                  key={index}
                  onClick={() => handleChoice(choice)}
                  className="w-full text-left justify-start h-auto py-4 px-6 text-base md:text-lg bg-muted hover:bg-accent hover:text-accent-foreground transition-all duration-300 border border-border hover:border-accent"
                  disabled={feedback !== ""}
                >
                  <span className="mr-3 text-secondary">→</span>
                  {choice.text}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Footer info */}
        <div className="mt-6 text-center text-muted-foreground text-sm animate-fade-in">
          <p>🔍 Les nøye og velg ditt neste steg</p>
        </div>
      </div>
    </div>
  );
}

const fs = require("fs");
const path = require("path");

const components = [
  {
    name: "chart",
    dependencies: [
      "react-native-gifted-charts",
      "gifted-charts-core",
      "react-native-svg",
      "expo-linear-gradient",
      "lucide-react-native",
    ],
    source: "components/ui/chart.tsx",
  },
  {
    name: "sonner",
    dependencies: ["sonner-native", "lucide-react-native"],
    source: "components/ui/sonner.tsx",
  },
  {
    name: "drawer",
    dependencies: [
      "@gorhom/bottom-sheet",
      "react-native-reanimated",
      "react-native-gesture-handler",
      "@rn-primitives/slot",
      "@rn-primitives/portal",
    ],
    source: "components/ui/drawer.tsx",
  },
];

function buildRegistry() {
  console.log("Building components registry...");

  const registry = {
    name: "native-shadcn",
    components: components
      .map((c) => {
        const sourcePath = path.join(process.cwd(), c.source);
        if (!fs.existsSync(sourcePath)) {
          console.error(`Source file not found: ${c.source}`);
          return null;
        }

        const content = fs.readFileSync(sourcePath, "utf8");

        return {
          name: c.name,
          dependencies: c.dependencies,
          files: [
            {
              name: path.basename(c.source),
              content: content,
            },
          ],
        };
      })
      .filter(Boolean),
  };

  const outputPath = path.join(process.cwd(), "registry.json");
  fs.writeFileSync(outputPath, JSON.stringify(registry, null, 2));

  console.log(`Registry generated at ${outputPath}`);
}

buildRegistry();

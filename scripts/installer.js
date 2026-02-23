const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const GITHUB_USER = "elijahsadiaza29";
const GITHUB_REPO = "native-shadcn";
const REGISTRY_URL = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/main/registry.json`;

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const componentName = args[1];

  if (command !== "add" || !componentName) {
    console.log("Usage: npx <your-package> add <component-name>");
    process.exit(1);
  }

  console.log(`🔍 Fetching registry...`);
  try {
    const response = await fetch(REGISTRY_URL);
    if (!response.ok) throw new Error("Failed to fetch registry");
    const registry = await response.json();

    const component = registry.components.find((c) => c.name === componentName);
    if (!component) {
      console.error(`❌ Component "${componentName}" not found in registry.`);
      console.log(
        "Available components:",
        registry.components.map((c) => c.name).join(", "),
      );
      process.exit(1);
    }

    // 1. Install dependencies
    if (component.dependencies && component.dependencies.length > 0) {
      console.log(
        `📦 Installing dependencies: ${component.dependencies.join(", ")}...`,
      );
      try {
        execSync(`npx expo install ${component.dependencies.join(" ")}`, {
          stdio: "inherit",
        });
      } catch (e) {
        console.warn(
          "⚠️ Dependency installation failed. Please install them manually.",
        );
      }
    }

    // 2. Write component files
    // We assume the user wants files in src/components/ui
    const targetDir = path.join(process.cwd(), "src", "components", "ui");
    if (!fs.existsSync(targetDir)) {
      console.log(`📂 Creating directory: ${targetDir}`);
      fs.mkdirSync(targetDir, { recursive: true });
    }

    component.files.forEach((file) => {
      const filePath = path.join(targetDir, file.name);
      console.log(`💾 Writing ${file.name}...`);
      fs.writeFileSync(filePath, file.content);
    });

    console.log(`\n✅ Successfully added ${componentName}!`);
    console.log(`📍 Location: src/components/ui/`);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

main();

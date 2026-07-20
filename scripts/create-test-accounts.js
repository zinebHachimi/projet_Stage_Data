const { MongoClient, ObjectId } = require("mongodb");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// Load .env variables manually to avoid external dependencies
try {
  const envPath = path.resolve(__dirname, "../.env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const index = trimmed.indexOf("=");
      if (index === -1) return;
      const key = trimmed.substring(0, index).trim();
      let val = trimmed.substring(index + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.substring(1, val.length - 1);
      }
      process.env[key] = val;
    });
  }
} catch (err) {
  console.log("Remarque: Fichier .env non détecté ou impossible à charger, utilisation des variables d'environnement globales.");
}

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("[x] Erreur : La variable d'environnement DATABASE_URL n'est pas définie dans .env.");
  process.exit(1);
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const accounts = [
  {
    name: "Administrateur AlgoJob",
    email: "admin@algojob.ma",
    password: "AdminAlgoJob2026!",
    role: "ADMIN",
  },
  {
    name: "Recruteur AlgoJob",
    email: "recruteur@algojob.ma",
    password: "RecruteurAlgoJob2026!",
    role: "ANALYST",
  },
  {
    name: "Candidat AlgoJob",
    email: "candidat@algojob.ma",
    password: "CandidatAlgoJob2026!",
    role: "VIEWER",
  },
];

async function main() {
  console.log("=== Création des comptes de test AlgoJob ===");
  console.log("Connexion à MongoDB...");
  
  const client = new MongoClient(dbUrl);
  await client.connect();
  
  const db = client.db(); // connects to database specified in URI
  const usersCollection = db.collection("User");
  
  for (const account of accounts) {
    try {
      const existing = await usersCollection.findOne({ email: account.email });
      
      const now = new Date();
      if (existing) {
        console.log(`[-] L'utilisateur ${account.email} existe déjà. Mise à jour de son rôle en ${account.role}...`);
        await usersCollection.updateOne(
          { email: account.email },
          {
            $set: {
              name: account.name,
              role: account.role,
              passwordHash: hashPassword(account.password),
              updatedAt: now,
            },
          }
        );
        console.log(`[+] Rôle et mot de passe mis à jour avec succès pour ${account.email}.`);
      } else {
        const userDoc = {
          _id: new ObjectId(),
          email: account.email,
          name: account.name,
          role: account.role,
          passwordHash: hashPassword(account.password),
          workspaceSlug: "default",
          createdAt: now,
          updatedAt: now,
        };
        await usersCollection.insertOne(userDoc);
        console.log(`[+] Compte ${account.role} créé avec succès : ${account.email}`);
      }
    } catch (error) {
      console.error(`[x] Erreur pour le compte ${account.email} :`, error.message);
    }
  }
  
  await client.close();
}

main()
  .then(() => {
    console.log("\n=== Terminé avec succès ! ===");
  })
  .catch((e) => {
    console.error("\n[x] Erreur critique lors de l'exécution :", e.message);
    process.exit(1);
  });

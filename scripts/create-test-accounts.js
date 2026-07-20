const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");

const prisma = new PrismaClient();

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
  
  for (const account of accounts) {
    try {
      const existing = await prisma.user.findUnique({
        where: { email: account.email },
      });
      
      if (existing) {
        console.log(`[-] L'utilisateur ${account.email} existe déjà. Mise à jour de son rôle en ${account.role}...`);
        await prisma.user.update({
          where: { email: account.email },
          data: {
            name: account.name,
            role: account.role,
            passwordHash: hashPassword(account.password),
          },
        });
        console.log(`[+] Rôle et mot de passe mis à jour avec succès pour ${account.email}.`);
      } else {
        await prisma.user.create({
          data: {
            name: account.name,
            email: account.email,
            role: account.role,
            passwordHash: hashPassword(account.password),
            workspaceSlug: "default",
          },
        });
        console.log(`[+] Compte ${account.role} créé avec succès : ${account.email}`);
      }
    } catch (error) {
      console.error(`[x] Erreur pour le compte ${account.email} :`, error.message);
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("\n=== Terminé avec succès ! ===");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

import express from "express"
import simpleGit, { SimpleGit, SimpleGitOptions } from "simple-git"

const options: Partial<SimpleGitOptions> = {
  baseDir: "/home/josep/Projects/currencies-demo-2",
  binary: "git",
  maxConcurrentProcesses: 6,
}

const git: SimpleGit = simpleGit(options)
const app = express()

app.post("/:branch/:commitIdx", (req, res) => {
  const { branch, commitIdx } = req.params

  git
    .checkout(branch)
    .log()
    .then((x) => {
      const commits = x.all.map((y) => y.hash).reverse()
      git.checkout(commits[Number(commitIdx)])
      res.setHeader("Access-Control-Allow-Origin", "*")
      res.send("DONE!")
    })
})

app.listen(1714)

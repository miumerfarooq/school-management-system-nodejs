import { createApp } from "./app";

const startServer = () => {
  try {
    const app = createApp()

    app.listen(process.env.PORT, () => {
      console.log(`http://localhost:${process.env.PORT}`)
    })
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

startServer()

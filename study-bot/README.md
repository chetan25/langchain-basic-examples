To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.29. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

#### Windows Installation

To check what distributions are installed on your windows, first open the `Windows Powershell` and than run the following command:

```
wsl -l -v
```

You might get something like this if you have distributions like Ubuntu or Docker Installed already

```
 NAME                   STATE           VERSION
* docker-desktop-data    Stopped         2
  docker-desktop         Stopped         2
  Ubuntu                 Running         2
```

If you don't have Ubuntu already installed you can run the following command:

```
wsl --install
```

After this you can run the Ubuntu installed distribution from `Windows Command Prompt` or `PowerShell`, you can enter the name of your installed distribution. For example: ubuntu

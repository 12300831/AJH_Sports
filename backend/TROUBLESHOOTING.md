# Troubleshooting: Port Already in Use

## Problem
```
Error: listen EADDRINUSE: address already in use :::5000
```

## Solutions

### Solution 1: Kill Process Using Port 5000 (Quick Fix)

```bash
# Kill all processes on port 5000
lsof -ti:5000 | xargs kill -9

# Or use the npm script
npm run kill-port
```

### Solution 2: Use a Different Port

**Option A: Use environment variable**
```bash
PORT=5001 npm start
```

**Option B: Update .env file**
```env
PORT=5001
```

Then restart:
```bash
npm start
```

### Solution 3: Find and Kill All Node Processes

```bash
# Find all node processes
ps aux | grep node

# Kill all node processes (be careful!)
pkill -9 node
```

### Solution 4: Use the Restart Script

```bash
npm run restart
```

This will automatically kill the port and restart the server.

## Prevention

1. **Always stop the server properly**: Use `Ctrl+C` in the terminal where the server is running
2. **Check for multiple terminals**: Make sure you're not running the server in multiple terminal windows
3. **Use process managers**: Consider using `pm2` or `nodemon` for better process management

## Check What's Using the Port

```bash
# See what process is using port 5000
lsof -i:5000

# See all processes using ports
lsof -i -P -n | grep LISTEN
```



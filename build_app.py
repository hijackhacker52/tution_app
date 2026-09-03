import os
import subprocess

app_dir = r"C:\Users\Administrator\.gemini\antigravity\scratch\tuition-app"
os.chdir(app_dir)

env = os.environ.copy()
node_dir = r"C:\Program Files\nodejs"
env["PATH"] = node_dir + os.pathsep + env.get("PATH", "")

print("Running npm install...")
res = subprocess.run([os.path.join(node_dir, "npm.cmd"), "install"], env=env, capture_output=True, text=True)
print("npm install STDOUT:", res.stdout)
print("npm install STDERR:", res.stderr)

print("Running npm run build...")
res_build = subprocess.run([os.path.join(node_dir, "npm.cmd"), "run", "build"], env=env, capture_output=True, text=True)
print("npm build STDOUT:", res_build.stdout)
print("npm build STDERR:", res_build.stderr)

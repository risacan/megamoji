desc "compile and run the site"
task :default do
  pids = [
    spawn("ruby -run -e httpd -- --port=8000 ./"),
    spawn("scss --watch _assets:assets"),
    spawn("coffee -b -w -o assets -c _assets/*.coffee")
  ]

  trap "INT" do
    Process.kill "INT", *pids
    exit 1
  end

  loop do
    sleep 1
  end
end
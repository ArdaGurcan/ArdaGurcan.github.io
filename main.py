import os

def application(environ,start_response):
    status = '200 OK'
    html = '<html>\n' \
           '<body>\n' \
           '<div style="width: 100%; font-size: 40px; font-weight: bold; text-align: center;">\n' \
           'Welcome to mod_wsgi Test Page\n' \
           '</div>\n' \
           '</body>\n' \
           '</html>\n'
    os.system("sudo cowsay -f tux | wall -n")
    response_header = [('Content-type','text/html')]
    start_response(status,response_header)
    return [html]

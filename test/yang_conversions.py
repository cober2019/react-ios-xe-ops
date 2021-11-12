import os, subprocess
import time

yang_dir = f"{os.getcwd()}/yangFiles"

def get_yang():
	
    global yang_dir

    files = [yang_file for yang_file in os.listdir(yang_dir) if yang_file.endswith(".yang")]

    return files


def get_standard_tree(model):
	
	
	get_model = subprocess.run(["pyang", "-f", "tree", f"{yang_dir}/{model}"], capture_output=True)
	model_stdout = str(get_model.stdout, 'utf-8')
	
	return model_stdout


def get_dynamic_tree(model):

    process = subprocess.Popen(['pyang', '-f', 'jstree',  '-o', f"{yang_dir}/jstree.html" , f'{model}'], shell=False)

    while process.poll() is None:
        time.sleep(1)

    return process.poll()


def get_yin(model):

    process = subprocess.Popen(['pyang', '-f', 'yin',  '-o', f"{yang_dir}/yin.xml" , f'{yang_dir}/{model}'], shell=False)

    while process.poll() is None:
        time.sleep(1)

    yin_file = open(f"{yang_dir}/yin.xml")
        
    return yin_file.read()

def get_xpaths(model):

        get_model = subprocess.run(["pyang", "-f", "xpath", f"{yang_dir}/{model}"], capture_output=True)
        model_stdout = str(get_model.stdout, 'utf-8')
        print(model_stdout)

        return model_stdout

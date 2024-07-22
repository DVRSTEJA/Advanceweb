from flask import Flask, render_template, request, redirect, session, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = '1234'
db = SQLAlchemy(app)


# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

    def __repr__(self):
        return f"<User {self.first_name}_{self.last_name}> {self.password}"
    
# Create database tables and sqlite file if not exists
with app.app_context():
    try:
        db.create_all()
        print("Created database")
    except Exception as e:
        print("Error creating database: %s", e)

# HELPER FUNCTIONS
def has_upper(string):
    for c in string:
        if c.isupper():
            return True
    return False

def has_lower(string):
    for c in string:
        if c.islower():
            return True
    return False

def ends_with_number(string):
    if len(string) >= 1 and string[-1].isdigit():
        return True
    return  False

def matches_length(string):
    if len(string) >= 8:
        return True
    return False

@app.route("/report")
def report():
    errors = session.get('errors')
    return render_template('report.html', error_list=errors)

def criteria_password(ps1,ps2):
    errors = []
    if ps1 != ps2:
        errors.append("Passwords do not match")
        return errors
    if not has_upper(ps1):
        errors.append("You did not use an uppercase character in password")
    if not has_lower(ps1):
        errors.append("You did not use an lowercase character in password")
    if not ends_with_number(ps1):
        errors.append("You did not end the password with a number")
    if not matches_length(ps1):
        errors.append("Password length needs to contain atleast 8 characters")
    return errors

@app.route("/", methods=['GET'])
def signin():
    error_list = session.get('error_list', None)
    if error_list:
        del session['error_list'] 
    return render_template('signin.html', error_list = error_list)

@app.route("/handle_signin", methods=['POST'])
def handle_signin():
    email = request.form.get('email')
    password = request.form.get('password')
    user = User.query.filter_by(email=email, password=password).first()
    if user:
        message =   f'You have succesfully logged in {user.first_name} {user.last_name}'
        return render_template('secretPage.html', user_name=message)
    session['error_list'] = ['Email or password is not correct']
    return redirect(url_for('signin'))

@app.route("/signin", methods=['GET'])
def signup():
    error_list = session.get('error_list', None)
    if error_list:
        del session['error_list']
    return render_template('signup.html', error_list = error_list)

@app.route("/handle_signup", methods=['POST'])
def handle_signup():
    first_name = request.form.get('firstname')
    last_name = request.form.get('lastname')
    email = request.form.get('email')
    password = request.form.get('password')
    cpassword = request.form.get('cpassword')

    errors = criteria_password(password,cpassword)
    if errors:
        session['error_list'] = errors
        return redirect(url_for('signup'))


    user = User.query.filter_by(email=email).first()
    if user:
        session['error_list'] =['User with this email already exists']
        return redirect(url_for('signup'))
    else:
        user = User(first_name=first_name, last_name=last_name, email=email, password=password)
        db.session.add(user)
        db.session.commit()
   
    return render_template('thankyou.html')
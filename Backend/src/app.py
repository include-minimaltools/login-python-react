from flask import Flask
import graphene
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
from flask_graphql import GraphQLView
import json
from flask_graphql_auth import (
    AuthInfoField,
    GraphQLAuth,
    get_jwt_identity,
    create_access_token,
    create_refresh_token,
    query_header_jwt_required,
    mutation_jwt_refresh_token_required,
    mutation_jwt_required
)
from sqlalchemy import *
from sqlalchemy.orm import (scoped_session, sessionmaker, relationship, backref)
from sqlalchemy.ext.declarative import declarative_base

engine = create_engine('sqlite:///data.db', convert_unicode=True)
db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))

Base = declarative_base()
Base.query = db_session.query_property()

app = Flask(__name__)
app.config['SECRET_KEY'] = 'ashish'
app.config["JWT_SECRET_KEY"] = "Ashish"

auth = GraphQLAuth(app)

@app.route('/')
def home():
    return 'home'
  
@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()

#############################################
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(20),unique=True,nullable=False)
    password = Column(String(60),nullable=False)
    email = Column(String(100))

    
class UserObject(SQLAlchemyObjectType):
   class Meta:
       model = User
       interfaces = (graphene.relay.Node, )

class CreateUser(graphene.Mutation):
    user = graphene.Field(UserObject)
    
    class Arguments:
        username =graphene.String(required=True)
        password =graphene.String(required=True)
        email =graphene.String(required=True)
    
    def mutate(self, info, username, password , email):
        user = User.query.filter_by(username=username).first()
        if user:
            return CreateUser(user=user)
        user = User(username=username,password=password,email=email)
        if user:
            db_session.add(user)
            db_session.commit()
        return CreateUser(user=user)
      

class AuthMutation(graphene.Mutation):
    access_token = graphene.String()
    refresh_token = graphene.String()

    class Arguments:
        username = graphene.String()
        password = graphene.String()
    
    def mutate(self, info , username, password) :
        user = User.query.filter_by(username=username,password=password).first()
        print(user)
        if not user:
            raise Exception('Authenication Failure : User is not registered')
        return AuthMutation(
            access_token = create_access_token(username),
            refresh_token = create_refresh_token(username)
        )
      
class RefreshMutation(graphene.Mutation):
    class Arguments(object):
        refresh_token = graphene.String()
    
    new_token = graphene.String()

    @mutation_jwt_refresh_token_required
    def mutate(self):
        current_user = get_jwt_identity()
        return RefreshMutation(new_token=create_access_token(identity=current_user))
        
class Mutation(graphene.ObjectType):
    auth = AuthMutation.Field()
    create_user = CreateUser.Field()
    refresh = RefreshMutation.Field() ## this is added

class Query(graphene.ObjectType):
    node = graphene.relay.Node.Field()
    all_users = SQLAlchemyConnectionField(UserObject)



Base.metadata.create_all(engine)
schema = graphene.Schema(query=Query, mutation=Mutation)

app.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=True
    )
)

if __name__ == '__main__':
    app.run(debug=True)
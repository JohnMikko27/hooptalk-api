from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    posts = relationship("Post", back_populates="author")
    comments = relationship("Comment", back_populates="author")

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True)
    content = Column(String)
    title = Column(String, index=True)
    author_id = Column(Integer, ForeignKey("users.id"))
    author = relationship("User", back_populates="posts")
# posts should have a list of comments also!!!!!!!

class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True)
    content = Column(String)
    author_id = Column(Integer, ForeignKey("users.id"))
    author = relationship("User", back_populates="comments")


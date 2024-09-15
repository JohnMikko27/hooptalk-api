from pydantic import BaseModel

class PostBase(BaseModel):
    content: str | None = None
    title: str
    author_id: int

class PostCreate(PostBase):
    class Config():
        from_attributes = True

class Post(PostBase):
    id: int
    class Config():
        from_attributes = True

class CommentBase(BaseModel):
    content: str
    author_id: int

class Comment(CommentBase):
    id: int
    class Config():
        from_attributes = True

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    posts: list[Post] = []
    comments: list[Comment] = []

    class Config():
        from_attributes = True

# class UserCreate(UserBase):
#     password: str

# class User(UserBase):

    

# class ItemBase(BaseModel):
#     title: str
#     description: str | None = None

# class ItemCreate(ItemBase):
#     pass

# class Item(ItemBase):
#     id: int
#     owner_id: int

#     class Config:
#         from_attributes = True

# class UserBase(BaseModel):
#     email: str

# class UserCreate(UserBase):
#     password: str

# class User(UserBase):
#     id: int
#     is_active: bool
#     items: list[Item] = []

#     class Config:
#         from_attributes = True
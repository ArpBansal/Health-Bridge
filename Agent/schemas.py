from pydantic import BaseModel
from typing import Optional, Literal, List, Dict, Any

class request(BaseModel):
    previous_state: Optional[List[Dict]]=None
    query: str
    user_data: Optional[Dict]=None
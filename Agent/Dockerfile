FROM python:3.12
RUN useradd -m -u 1000 user
USER user
WORKDIR /code
RUN chown -R user:user /code
ENV HOME=/home/user
ENV PATH=/home/user/.local/bin:$PATH
WORKDIR $HOME/app
COPY ./requirements.txt ./
RUN pip install --no-cache-dir -r ./requirements.txt
COPY --chown=user . $HOME/app
# COPY --chown=user:user . /code
# COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
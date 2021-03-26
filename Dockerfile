FROM ubuntu
RUN apt-get update && apt-get install -y ruby ruby-dev ruby-bundler build-essential ruby-dev
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
#RUN apt-get install ruby-full
RUN bundle config --global frozen
#RUN bundle install
#RUN apk add build-base
#RUN bundle update mime-types
#RUN gem install -N rails
#RUN apt-get install ruby-full

RUN gem install rails -v '6.1.1'
#WORKDIR /app
#ADD Gemfile Gemfile.lock /app/
#RUN bundle install

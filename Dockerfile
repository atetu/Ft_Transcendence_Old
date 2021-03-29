FROM ruby:2.5.1

RUN apt-get update -qq && apt-get install -y ruby-dev ruby-bundler build-essential postgresql-client

# RUN bundle config --global frozen

# for postgres
RUN apt-get install -y libpq-dev
# RUN curl -sL https://deb.nodesource.com/setup_10.x 
RUN apt-get install -y nodejs
# for nokogiri
# RUN apt-get install -y libxml2-dev libxslt1-dev

# for capybara-webkit
# RUN apt-get install -y libqt4-webkit libqt4-dev xvfb

#for a JS runtime
# RUN apt-get install -y nodejs

WORKDIR /myapp
COPY Gemfile /myapp/Gemfile
COPY Gemfile.lock /myapp/Gemfile.lock

# WORKDIR /usr/src/app
# RUN gem install pg -v '0.18.1'
# RUN yarn install
RUN bundle install
# RUN npm install
# RUN rails webpacker:install
COPY . /myapp
# COPY entrypoint.sh /usr/bin/
# RUN chmod +x entrypoint.sh
# ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000

# ADD . $APP_HOME
# COPY . /usr/src/app/
# ENV POSTGRES_USER=postgres
# ENV POSTGRES_DB=myapp_development
# ENV DATABASE_HOST=database
# CMD ["rails", "server"]
CMD ["rails", "s", "-b", "0.0.0.0"]
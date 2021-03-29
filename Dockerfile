FROM ruby:2.5.1

RUN apt-get update -qq && apt-get install -y ruby-dev ruby-bundler build-essential

RUN bundle config --global frozen

# for postgres
RUN apt-get install -y libpq-dev

# for nokogiri
# RUN apt-get install -y libxml2-dev libxslt1-dev

# for capybara-webkit
# RUN apt-get install -y libqt4-webkit libqt4-dev xvfb

#for a JS runtime
RUN apt-get install -y nodejs

ENV APP_HOME /myapp
RUN mkdir $APP_HOME
WORKDIR $APP_HOME

COPY Gemfile /myapp/Gemfile
COPY Gemfile.lock /myapp/Gemfile.lock
# WORKDIR /usr/src/app
# RUN gem install pg -v '0.18.1'
# RUN yarn install
RUN bundle install

# ADD . $APP_HOME
# COPY . /usr/src/app/
# ENV POSTGRES_USER=postgres
# ENV POSTGRES_DB=myapp_development
# ENV DATABASE_HOST=database
# CMD ["rails", "server"]
CMD ["rails", "s", "-b", "0.0.0.0"]
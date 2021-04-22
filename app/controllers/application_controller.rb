class ApplicationController < ActionController::Base
  include CanCan::ControllerAdditions

  skip_before_action :verify_authenticity_token

  rescue_from ActiveRecord::RecordInvalid, :with => :render_error_validation
  rescue_from ActionController::ParameterMissing, :with => :render_error_parameter_missing
  rescue_from ActiveRecord::RecordNotFound, :with => :render_error_not_found
  rescue_from CanCan::AccessDenied, :with => :render_error_access_denied
  rescue_from Api::BaseException, :with => :render_error_api

  def render_error(json, status)
    render({
      json: json,
      status: status,
    })
  end

  def render_error_validation(error)
    render_error({
      message: "validation failed",
      fields: error.record.errors.as_json,
    }, :not_acceptable)
  end

  def render_error_parameter_missing(error)
    render_error({
      message: "parameter missing",
      name: error.param,
    }, :not_acceptable)
  end

  def render_error_not_found(error)
    render_error({
      message: error.to_s,
    }, :not_found)
  end

  def render_error_access_denied(error)
    render_error({
      message: error.to_s,
    }, :forbidden)
  end

  def render_error_api(error)
    render({
      message: error.message(),
    }, error.status())
  end
end

namespace AspDotNet.Shared;

public class AppException(string message, int code) : Exception(message)
{
  public int Code { get; } = code;

}


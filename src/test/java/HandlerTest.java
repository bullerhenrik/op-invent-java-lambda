import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.amazonaws.services.lambda.runtime.tests.annotations.Events;
import com.amazonaws.services.lambda.runtime.tests.annotations.HandlerParams;
import com.amazonaws.services.lambda.runtime.tests.annotations.Responses;
import org.junit.jupiter.params.ParameterizedTest;
import se.omegapoint.HelloWorldHandler;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class HandlerTest {
  @ParameterizedTest
  @HandlerParams(
          events = @Events(folder = "events/", type = APIGatewayProxyRequestEvent.class),
          responses = @Responses(folder = "responses/", type = APIGatewayProxyResponseEvent.class)
  )
  public void testMultipleEventsResponsesInFolder(APIGatewayProxyRequestEvent event, APIGatewayProxyResponseEvent expectedResponse) {
    var handler = new HelloWorldHandler();

    APIGatewayProxyResponseEvent actualResponse = handler.handleRequest(event, null);

    assertEquals(expectedResponse.getStatusCode(), actualResponse.getStatusCode());
    assertEquals(expectedResponse.getBody(), actualResponse.getBody());
  }
}
